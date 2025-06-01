export enum Status {
    Waiting = 'waiting',
    Accepted = 'accepted',
    Rejected = 'rejected'
}

export const StatusLabels: Record<Status, string> = {
    [Status.Waiting]: 'Waiting',
    [Status.Accepted]: 'Accepted',
    [Status.Rejected]: 'Rejected'
};
