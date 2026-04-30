import React, { useMemo, useState } from 'react';

const CONTACTS = [
  {
    id: 'angelica',
    name: 'Angelica - Design Lab',
    status: 'Online',
    personalMessage: 'polishing nostalgia pixels',
    away: false,
    messages: [
      { from: 'them', text: 'The XP shell already feels good. Add more little system details.' },
      { from: 'me', text: 'Working on drag-and-drop icons and a proper control panel now.' },
      { from: 'them', text: 'Nice. Keep the old Messenger warmth in the UI.' },
    ],
  },
  {
    id: 'thesis',
    name: 'PetSOS Thesis Team',
    status: 'Away',
    personalMessage: 'brb, testing rescue flows',
    away: true,
    messages: [
      { from: 'them', text: 'Reminder: geolocation rescue flow is the strongest demo item.' },
      { from: 'me', text: 'Noted. I am surfacing it better inside the portfolio OS.' },
    ],
  },
  {
    id: 'freelance',
    name: 'Freelance Leads',
    status: 'Busy',
    personalMessage: 'shipping WordPress updates',
    away: false,
    messages: [
      { from: 'them', text: 'Warduz Pet Shop layout is live and responsive.' },
      { from: 'me', text: 'Good. I am also linking it from the project explorer.' },
    ],
  },
];

const STATUS_STYLES = {
  Online: 'bg-[#4cb748]',
  Away: 'bg-[#f2c12c]',
  Busy: 'bg-[#d94848]',
};

export default function MessengerApp() {
  const [activeContactId, setActiveContactId] = useState(CONTACTS[0].id);
  const activeContact = useMemo(
    () => CONTACTS.find((contact) => contact.id === activeContactId) ?? CONTACTS[0],
    [activeContactId],
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden font-['Tahoma'] text-[11px] text-[#1e2740]">
      <div className="border-b border-[#183975] bg-linear-to-b from-[#7ca6ff] via-[#4677d9] to-[#2453bf] px-3 py-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
        <div className="text-[18px] font-bold">MSN Messenger</div>
        <div className="text-[11px] text-white/90">Signed in as Visitor . Available on Windows XP Portfolio</div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)] bg-[#dfe8f8]">
        <aside className="border-r border-[#91a8d2] bg-linear-to-b from-[#eff5ff] to-[#d5e1f7]">
          <div className="border-b border-[#adc0e1] px-3 py-2">
            <div className="rounded border border-[#88a2d5] bg-white px-3 py-2 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]">
              <div className="text-[13px] font-bold text-[#214ea5]">Visitor</div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[#39517a]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#4cb748]" />
                <span>Online</span>
              </div>
            </div>
          </div>

          <div className="border-b border-[#adc0e1] px-3 py-2 text-[11px] font-bold text-[#214ea5]">Contacts</div>
          <div className="overflow-auto">
            {CONTACTS.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => setActiveContactId(contact.id)}
                className={`flex w-full items-start gap-3 border-b border-[#d3def4] px-3 py-3 text-left ${contact.id === activeContact.id ? 'bg-[#c6d8f8]' : 'bg-transparent hover:bg-[#e8f0ff]'}`}
              >
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded border border-[#8aa3d6] bg-white text-[12px] font-bold text-[#23478f]">
                  {contact.name.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[contact.status]}`} />
                    <span className="truncate font-bold text-[#183975]">{contact.name}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-[#4f648d]">{contact.status}</div>
                  <div className="mt-1 truncate text-[10px] text-[#6a7da2]">{contact.personalMessage}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col bg-white">
          <div className="border-b border-[#c3d2eb] bg-linear-to-b from-[#f7fbff] to-[#e2edf9] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[16px] font-bold text-[#214ea5]">{activeContact.name}</div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#556b8f]">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[activeContact.status]}`} />
                  <span>{activeContact.away ? 'Away message enabled' : 'Ready to chat'}</span>
                </div>
              </div>
              <div className="rounded border border-[#90a9d5] bg-white px-3 py-1 text-[11px] text-[#214ea5] shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]">
                {activeContact.personalMessage}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-auto bg-[linear-gradient(180deg,#ffffff,#f7fbff)] px-4 py-4">
            {activeContact.messages.map((message, index) => (
              <div key={`${activeContact.id}-${index}`} className={`max-w-[78%] rounded border px-3 py-2 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)] ${message.from === 'me' ? 'ml-auto border-[#98b4e6] bg-[#dce9ff] text-[#1f3668]' : 'border-[#d6dfe9] bg-[#f7f9fc] text-[#33415b]'}`}>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6d7d97]">
                  {message.from === 'me' ? 'You' : activeContact.name}
                </div>
                <div className="mt-1 text-[12px] leading-5">{message.text}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#c3d2eb] bg-[#eef4fd] px-4 py-3">
            <div className="rounded border border-[#8ea9d7] bg-white px-3 py-2 text-[11px] text-[#8a98b0] shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]">
              Type a message... nostalgic chat input intentionally disabled.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
