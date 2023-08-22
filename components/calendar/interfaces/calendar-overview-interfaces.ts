export interface ICalendarOverviewProps {
    className: string,

}

export interface ICalendarOverviewState {
    shownYear: number,
    events: ICalendarEvent[],
}

export interface ICalendarEvent {
    id: string,
    title: string,
    notes: string,
    start: string,
    end: string,
    links: string
}
