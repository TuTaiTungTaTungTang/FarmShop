import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const eventsState = useSelector((state) => state.events) || {};
  const { allEvents = [], isLoading } = eventsState;

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>
          <div className="w-full grid">
            {allEvents.length > 0 ? (
              allEvents.map((event, idx) => (
                <EventCard key={event._id || idx} data={event} />
              ))
            ) : (
              <h4 className="text-blue-600 font-semibold">No Events have!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
