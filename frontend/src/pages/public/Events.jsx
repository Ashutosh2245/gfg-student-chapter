import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../../services/api';
import { Calendar, MapPin, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventsAPI.getEvents();
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(e => e.status === 'UPCOMING' || new Date(e.event_date) > new Date());
  const pastEvents = events.filter(e => e.status === 'COMPLETED' || new Date(e.event_date) <= new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gfg-500/10 text-gfg-accent text-xs font-semibold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>Chapter Events & Hackathons</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">
          Events & <span className="text-gfg-accent">Coding Workshops</span>
        </h1>
        <p className="text-sm text-gray-400">
          Participate in national hackathons, competitive programming sprints, and technical bootcamp workshops at NIET.
        </p>
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-dark-border pb-3">
          <Sparkles className="w-5 h-5 text-gfg-accent" />
          <span>Upcoming Chapter Events</span>
        </h2>

        {upcomingEvents.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center text-gray-400 text-sm">
            No upcoming events scheduled right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="bg-dark-card border border-dark-border hover:border-gfg-500/40 rounded-3xl overflow-hidden transition-all flex flex-col justify-between">
                <div>
                  <img src={ev.banner_url} alt={ev.title} className="w-full h-56 object-cover" />
                  <div className="p-6 space-y-3">
                    <span className="text-xs font-mono font-bold text-gfg-accent px-2.5 py-1 rounded bg-gfg-500/10 border border-gfg-500/20">
                      UPCOMING HACKATHON
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{ev.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{ev.description}</p>
                    
                    <div className="pt-2 space-y-1 text-xs text-gray-400 font-mono">
                      <p>📅 {new Date(ev.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p>📍 {ev.venue}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {ev.registration_url && (
                    <a
                      href={ev.registration_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-gfg-500 hover:bg-gfg-hover text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                    >
                      <span>Register Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Events Gallery */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-dark-border pb-3">
          <CheckCircle2 className="w-5 h-5 text-gray-400" />
          <span>Past Accomplished Events</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pastEvents.map((ev) => (
            <div key={ev.id} className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden flex flex-col justify-between">
              <div>
                <img src={ev.banner_url} alt={ev.title} className="w-full h-48 object-cover opacity-80" />
                <div className="p-6 space-y-2">
                  <span className="text-[10px] font-mono text-gray-400 px-2 py-0.5 rounded bg-dark-bg border border-dark-border">
                    COMPLETED
                  </span>
                  <h3 className="text-lg font-bold text-white">{ev.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{ev.description}</p>
                  <p className="text-xs text-gray-500 font-mono pt-1">📍 {ev.venue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
