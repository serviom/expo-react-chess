import React, {FC} from 'react';
import {Calendar} from "antd";
import {IEvent} from '../models/IEvent';
import {Moment} from "moment";
import {formatDate} from '../utils/date';
import dayjs from 'dayjs';
// import 'dayjs/locale/uk-au';
import type { Dayjs } from 'dayjs';
// import dayLocaleData from 'dayjs/plugin/localeData';
//
// dayjs.extend(dayLocaleData);

interface EventCalendarProps {
    events: IEvent[];
}

const EventCalendar: FC<EventCalendarProps> = (props) => {

    function dateCellRender(value: Dayjs) {
        const formattedDate = formatDate(value.toDate());
        const currentDayEvents = props.events.filter(ev => ev.date === formattedDate);
        return (
            <div>
                {currentDayEvents.map((ev, index) =>
                    <div key={index}>{ev.description}</div>
                )}
            </div>
        );
    }

    return (
        <Calendar
            dateCellRender={dateCellRender}
        />
    );
};

export default EventCalendar;
