import { describe, it, expect, vi, beforeEach } from "vitest"
import * as server from "@/lib/supabase/server"
import * as pollActions from "@/lib/actions/poll-actions"
import { pollService } from "@/lib/db/poll-service"

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/db/poll-service", async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    pollService: {
      createPoll: vi.fn(),
      vote: vi.fn(),
      getUserPolls: vi.fn(),
    },
  }
})

describe("poll-actions integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("creates a poll then updates it successfully (integration happy path)", async () => {
    const createClient = server.createClient as unknown as vi.Mock
    // Minimal supabase mocks used by actions
    const supabaseMock = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null }),
      },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === 'polls') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { author_id: "user-1", is_active: true }, error: null })
              })
            }),
            update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
            delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
          }
        }
        if (table === 'poll_options') {
          return {
            update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
            insert: vi.fn().mockResolvedValue({ error: null }),
            delete: vi.fn().mockReturnValue({ in: vi.fn().mockResolvedValue({ error: null }) }),
          }
        }
        return {}
      }),
    }
    createClient.mockResolvedValue(supabaseMock)

    // 1) Create poll
    ;(pollService.createPoll as vi.Mock).mockResolvedValue({ id: "poll-1" })
    const createResult = await pollActions.createPoll({
      title: "Original title",
      description: "Original description long enough",
      options: ["A", "B"],
    })
    expect(createResult.success).toBe(true)

    // 2) Update poll
    const updateResult = await pollActions.updatePoll({
      id: "poll-1",
      title: "Updated title",
      description: "Updated description long enough",
      isActive: true,
      options: [
        { id: "opt-1", text: "A*", isDeleted: false },
        { id: "opt-2", text: "B*", isDeleted: false },
        { text: "C", isNew: true, isDeleted: false },
      ],
    })

    expect(updateResult.success).toBe(true)
    expect(supabaseMock.from).toHaveBeenCalledWith('polls')
    expect(supabaseMock.from).toHaveBeenCalledWith('poll_options')
  })
})


