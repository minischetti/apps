export enum Status {
    Pending = 'pending',
    Completed = 'completed',
    Canceled = 'canceled',
    Archived = 'archived',
}

type Item = {
    name: string,
    tags: string,
    date: string,
    time: string,
    status: Status,
}