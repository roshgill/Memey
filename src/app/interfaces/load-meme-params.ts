export interface LoadMemesParams {
    app: any;
    firstTimeMemes: boolean;
    imageNum: number;
    isLoading: boolean;
    isDisabled: boolean;
    initialLoadComplete: Promise<void> | undefined;
    memesPageToken: string | undefined;
    memesListReference: any;
    memeImages: { title: string; imageUrl: string; color: string; betaUsername: string; }[];
    promiseState: string;
    storage: any;
  }