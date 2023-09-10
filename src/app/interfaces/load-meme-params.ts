export interface LoadMemesParams {
    firstTimeMemes: boolean;
    imageNum: number;
    isLoading: boolean;
    isDisabled: boolean;
    initialLoadComplete: Promise<void> | undefined;
    memesPageToken: string | undefined;
    memesListReference: any;
    memeImages: { title: string; imageUrl: string; betaUsername: string; }[];
    promiseState: string;
    storage: any;
  }