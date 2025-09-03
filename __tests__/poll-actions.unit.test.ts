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

describe("poll-actions createPoll", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("creates a poll when authenticated and data valid (happy path)", async () => {
    const createClient = server.createClient as unknown as vi.Mock
    const supabaseMock = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null }),
      },
    }
    createClient.mockResolvedValue(supabaseMock)

    ;(pollService.createPoll as vi.Mock).mockResolvedValue({ id: "poll-1" })

    const result = await pollActions.createPoll({
      title: "My Poll",
      description: "A description that is long enough",
      options: ["A", "B"],
    })

    expect(result.success).toBe(true)
    expect(pollService.createPoll).toHaveBeenCalledWith(
      { title: "My Poll", description: "A description that is long enough", options: ["A", "B"] },
      "user-1",
    )
  })

  it("throws when user is unauthenticated (edge case)", async () => {
    const createClient = server.createClient as unknown as vi.Mock
    const supabaseMock = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    }
    createClient.mockResolvedValue(supabaseMock)

    await expect(
      pollActions.createPoll({ title: "T", description: "Description long enough", options: ["A", "B"] })
    ).rejects.toThrow(/logged in/i)
  })
})

describe("poll-actions updatePoll validation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("rejects when fewer than 2 options after trimming/deletions (failure case)", async () => {
    const createClient = server.createClient as unknown as vi.Mock
    const supabaseMock = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { author_id: "user-1" }, error: null }) }) })
      }),
    }
    createClient.mockResolvedValue(supabaseMock)

    await expect(
      pollActions.updatePoll({
        id: "poll-1",
        title: "Valid title",
        description: "Valid description",
        isActive: true,
        options: [
          { id: "opt-1", text: "Keep", isDeleted: false },
          { id: "opt-2", text: "Remove", isDeleted: true },
        ],
      })
    ).rejects.toThrow(/at least 2 valid options/i)
  })
})


