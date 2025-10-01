import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  // Sử dụng đúng key reducer: state.event
  const { allEvents = [], isLoading } = useSelector((state) => state.event || {});
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          {allEvents.length !== 0 ? (
            allEvents.map((event) => (
              <EventCard key={event.id} active={true} data={event} />
            ))
          ) : (
            <p>No events available.</p>
          )}
        </div>
      )}
    </>
  );
};

export default EventsPage;
