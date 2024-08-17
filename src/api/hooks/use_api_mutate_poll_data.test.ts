import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { ApiResponse } from "@xng/reporting";
import useApiMutatePollData from "./use_api_mutate_poll_data";
import { TestProviders } from "../../setupTests";
import { act } from "react-dom/test-utils";

jest.useFakeTimers({ doNotFake: ["setInterval"] });

type ResolvedResponse = { testResponse: string };
type Data = ApiResponse<ResolvedResponse>;
type Body = { testBody: string };

function generateResponse(status: number): Data {
  return {
    raw: new Response("", {
      status,
      headers: new Headers(),
      statusText: "OK",
    }),
    value() {
      return Promise.resolve<ResolvedResponse>({
        testResponse: "test",
      });
    },
  };
}

afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
  jest.clearAllMocks();
  cleanup();
});

describe("useApiMutatePollData", () => {

  it("should remain pending when polling is pending and only call the onSuccess or onSettled callback when polling is complete", async () => {
    const mockedPendingApiClientRaw = jest.fn((body: Body) => {
      return new Promise<Data>((resolve) => {
        resolve(generateResponse(202));
      })
    })

    const onMutateMockFn = jest.fn();
    const onSuccessMockFn = jest.fn();
    const onSettledMockFn = jest.fn();


    const { result, unmount } = renderHook(() => useApiMutatePollData<ResolvedResponse, Body>({
      mutationFn: async (body: Body) => mockedPendingApiClientRaw(body),
      mutationKey: ["test"],
      intervalDelay: 10,
      onSuccess: onSuccessMockFn,
      onSettled: onSettledMockFn,
      onMutate: onMutateMockFn
    }), { wrapper: TestProviders });

    await act(async () => {
      result.current.mutate({ testBody: "test" });
    });

    await waitFor(() => {
      expect(result.current.status).toBe("pending");
    });

    await waitFor(() => {
      expect(onMutateMockFn).toHaveBeenCalledTimes(4);
    });

    expect(onSuccessMockFn).not.toHaveBeenCalled();
    expect(onSettledMockFn).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);

    mockedPendingApiClientRaw.mockImplementationOnce((body: Body) => {
      return new Promise<Data>((resolve) => {
        resolve(generateResponse(200));
      })
    });

    await waitFor(() => {
      expect(onSettledMockFn).toHaveBeenCalled();
    });

    expect(onSuccessMockFn).toHaveBeenCalledTimes(1);
    expect(onSettledMockFn).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("success");
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isPending).toBe(false); // NEGATIVE TEST FOR GOOD MEASURE

    unmount();
  })

  it("should await mutate async function whenever we use that to make a request", async () => {
    // jest.useRealTimers();
    const mockedPendingApiClientRaw = jest.fn((body: Body) => {
      return new Promise<Data>((resolve) => {
        resolve(generateResponse(202));
      })
    })

    const onSuccessMockFn = jest.fn();
    const onSettledMockFn = jest.fn();

    const { result } = renderHook(() => useApiMutatePollData<ResolvedResponse, Body>({
      mutationFn: async (body: Body) => mockedPendingApiClientRaw(body),
      mutationKey: ["test"],
      intervalDelay: 1,
      onSuccess: onSuccessMockFn,
      onSettled: onSettledMockFn
    }), { wrapper: TestProviders });


    // let value: ResolvedResponse | undefined = undefined;
    await act(async () => {
      result.current.mutateAsync({ testBody: "test" });
    });

    await waitFor(() => {
      expect(result.current.status).toBe("pending");
    });
    // jest.advanceTimersByTime(10);

    expect(onSuccessMockFn).not.toHaveBeenCalled();
    expect(onSettledMockFn).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);

    mockedPendingApiClientRaw.mockImplementationOnce((body: Body) => {
      return new Promise<Data>((resolve) => {
        resolve(generateResponse(200));
      })
    });

    await waitFor(() => {
      expect(onSettledMockFn).toHaveBeenCalled();
    });

    expect(onSuccessMockFn).toHaveBeenCalled();
    expect(result.current.status).toBe("success");
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isPending).toBe(false); // NEGATIVE TEST FOR GOOD MEASURE


  });
  
  it("should remain pending when poling is pending and only call the onSuccess or onSettled callback when polling is complete (Polling mechanism Extend)", async () => {
    const mockedPendingApiClientRaw = jest.fn((body: Body) => {
      return new Promise<Data>((resolve) => {
        resolve(generateResponse(202));
      })
    })

    const onMutateMockFn = jest.fn();
    const onSuccessMockFn = jest.fn();
    const onSettledMockFn = jest.fn();


    const { result, unmount } = renderHook(() => useApiMutatePollData({
      mutationFn: async () => mockedPendingApiClientRaw({
        testBody: "test"
      }),
      intervalDelay: 10,
      mutationKey: ["test"],
      onSuccess: onSuccessMockFn,
      onSettled: onSettledMockFn,
      onMutate: onMutateMockFn
 
    }), { wrapper: TestProviders });

    await act(async () => {
      result.current.start();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("pending");
    });

    await waitFor(() => {
      expect(onMutateMockFn).toHaveBeenCalledTimes(4);
    });

    expect(onSuccessMockFn).not.toHaveBeenCalled();
    expect(onSettledMockFn).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);

    mockedPendingApiClientRaw.mockImplementationOnce((body: Body) => {
      return new Promise<Data>((resolve) => {
        resolve(generateResponse(200));
      })
    });

    await waitFor(() => {
      expect(onSettledMockFn).toHaveBeenCalled();
    });

    expect(onSuccessMockFn).toHaveBeenCalledTimes(1);
    expect(onSettledMockFn).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("success");
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isPending).toBe(false); // NEGATIVE TEST FOR GOOD MEASURE

    unmount();
  })
});