window.addEventListener("DOMContentLoaded", (e) => {
  buildAgenda(testAgenda);
});

const checkPrevSessionTime = (s, prev) =>
  prev === undefined || prev === null ? false : s === prev;

function buildAgenda(day) {
  const currentDateTime = new Date();
  const mockTime = new Date("Feb 19 2023 12:00");

  //START FULL PAGE FUNCTIONALITY
  //
  // const getSessions = () => {
  //   let allDays = []
  //   testAgenda.forEach(({ sessions }) => {
  //     allDays.push(sessions)
  //   })
  //   return allDays
  // }

  // const allSessions = getSessions().flat()
  //END FULL PAGE FUNCTIONALITY

  const today = testAgenda.filter(
    ({ date }) => date.getDay() === mockTime.getDay()
  )[0].sessions.filter(s => new Date(s.startTime) > currentDateTime);

  const activeSessions = today
    .filter((s) => new Date(s.startTime) > currentDateTime)
    .map((session, i) => {
      //START TIME FUNCTIONS
      const startTime = new Date(session.startTime).toLocaleTimeString(
        "en-US",
        { hour: "2-digit", minute: "2-digit" }
      );

      const endTime = new Date(session.endTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const hasPreviousIndex = i > 0 ? i : false;
      const lastIndex = i === today.length - 1;
      const nextSessionStartTime = !lastIndex
        ? today[i + 1].startTime
        : today[i].startTime;

      const previousStartTime = hasPreviousIndex
        ? new Date(today[hasPreviousIndex - 1].startTime).toLocaleTimeString(
          "en-US",
          { hour: "2-digit", minute: "2-digit" }
        )
        : undefined;

      const previousEndTime = hasPreviousIndex
        ? new Date(today[hasPreviousIndex - 1].endTime).toLocaleTimeString(
          "en-US",
          { hour: "2-digit", minute: "2-digit" }
        )
        : undefined;

      const isActive = active();

      function active() {
        const { startTime, endTime } = session;
        if (startTime >= mockTime && mockTime < endTime) {
          if (startTime > mockTime) {
            return false;
          } else {
            return true;
          }
        }
      }

      //END TIME FUNCTIONS

      //START SESSION CHAIR AND AGENDA HEADING SECTION

      const todaysSession = testAgenda.filter(
        (day) => day.date.getDay() === today[0].startTime.getDay()
      )[0];

      const programHeader = document.querySelector('.program-header')
      //refactor the rest of this abomination to look like below
      programHeader.innerHTML = `
        <h1 class="program-title">${todaysSession.title}</h1>
        <span class="program-subtitle"></span>
        <div class="program-date">${todaysSession.date.toDateString('en-US')}</div>
        <div class="session-speaker">
          <div class="session-speaker-info">
            Session Speaker:
            <div style="font-weight: bold; padding-top: 3px">${todaysSession.sessionChair[0].firstName} ${todaysSession.sessionChair[0].lastName}, ${todaysSession.sessionChair[0].title}</div>
          </div>
          <img class="chair-speaker-avatar" src="${todaysSession.sessionChair[0].img}" alt="photo of keynote speaker for todays session"/>
        </div>
      `

      //END SESSION CHAIR AND AGENDA HEADING SECTION

      const dailyAgendaContainer = `
          <div class="program-timeline-wrap">
            <ul class="program-timeline current">
              <li class="program-schedule current">
              <span>
              ${startTime.split(" ")[0]}
              <span style="font-size: 14px; margin-left: 4px">
              ${startTime.split(" ")[1]}
              </span>
              </span>
              </li>
              <li class="program-progress">
              <span>
                <span class="program-timepoint pulsate">
                </span>
                <span class="program-timebar">
                </span>
              </span>
            </li>
          <li class="program-info-wrap current">
            <div class="program-info-title enlarged">Welcome and Introductions</div>
            <div class="program-info-subtitle">
              <div class="speaker-container"><img class="program-speaker-avatar enlarged-img"
                  src="https://events.medscapelive.org/file_uploads/f5724a1f9f9fc78550f6137395a4c9f2_blakeley_jaishri.jpg">
                <div>Blakely Jaishri<div class="speaker-title">MD, PhD.</div>
                </div>
              </div>
            </div>
            <div class="program-info-topic">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia neque
              obcaecati, libero debitis dignissimos voluptatibus in ipsum veritatis soluta fugit consequatur delectus,
              nam est. Delectus!<div class="time-span">Ends at: 12:50 PM</div>
            </div>
          </li>
        </ul>
      </div>
      `

      const programTimeline = document.createElement("ul");
      programTimeline.className = "program-timeline";

      if (isActive) {
        programTimeline.classList.add("current");
      }

      const programSchedule = document.createElement("li");
      programSchedule.className = "program-schedule";
      //if programs occur concurrently, we do not want to list all the times in the left hand column - just the first program occuring at the given time. this checks equality of the previous program and, if equal, displays nothing. otherwise it displays the time.
      !isActive
        ? programSchedule.classList.add("inactive")
        : programSchedule.classList.add("current");
      programSchedule.innerHTML = !checkPrevSessionTime(
        startTime,
        previousStartTime
      )
        ? `<span>${startTime.split(" ")[0]
        }<span style="font-size: 14px; margin-left: 4px">${startTime.split(" ")[1]
        }</span></span>`
        : "";

      programTimeline.appendChild(programSchedule);
      if (isActive) {
        programTimeline.classList.add("current");
      }

      const programProgress = document.createElement("li");
      programProgress.className = "program-progress";
      const emptySpan = document.createElement("span");

      const programTimepoint = document.createElement("span");
      programTimepoint.classList.add("program-timepoint");

      isActive
        ? programTimepoint.classList.add("pulsate")
        : programTimepoint.classList.add("inactive");

      const programTimebar = document.createElement("span");
      programTimebar.className = "program-timebar";

      emptySpan.appendChild(programTimepoint);
      emptySpan.appendChild(programTimebar);

      programProgress.appendChild(emptySpan);

      programTimeline.appendChild(programProgress);

      const programInfoWrap = document.createElement("li");
      programInfoWrap.classList.add("program-info-wrap");
      !isActive
        ? programInfoWrap.classList.add("inactive")
        : programInfoWrap.classList.add("current");

      const programInfoTitle = document.createElement("div");
      programInfoTitle.className = "program-info-title";
      programInfoTitle.textContent = session.title;

      const programInfoTopic = document.createElement("div");
      programInfoTopic.className = "program-info-topic";
      programInfoTopic.textContent = session.topic

      const timeSpan = document.createElement("div");

      timeSpan.className = "time-span";
      timeSpan.textContent = `Ends at: ${endTime}`;

      const statusChip = document.createElement("li");
      statusChip.innerText = "In Progress";
      statusChip.className = "status-chip";

      programInfoTopic.appendChild(timeSpan);

      if (isActive && session.startTime > mockTime) {
        timeSpan.appendChild(statusChip);
      }

      if (isActive) {
        programInfoTitle.classList.add("enlarged");
      }

      const programInfoSubtitle = document.createElement("div");
      programInfoSubtitle.className = "program-info-subtitle";

      const speakers = session.speaker.map((sp) => {
        const speakerContainer = document.createElement("div");
        speakerContainer.className = "speaker-container";

        const speakerImage = document.createElement("img");
        speakerImage.className = "program-speaker-avatar";

        // isActive ? speakerImage.classList.add("enlarged-img") : null;

        if (isActive) {
          speakerImage.classList.add("enlarged-img");
        }

        speakerImage.src = sp.img
          ? sp.img
          : "https://www.placecage.com/100/100";

        //set the speakers info
        const speakerInfo = document.createElement("div");
        const speakerTitle = document.createElement("div");

        speakerInfo.innerText = `${sp.firstName} ${sp.lastName}`;
        speakerInfo.appendChild(speakerTitle);
        speakerTitle.className = "speaker-title";
        speakerTitle.innerText = sp.title;

        speakerContainer.appendChild(speakerImage);
        speakerContainer.appendChild(speakerInfo);

        return speakerContainer;
      });

      speakers.forEach((s) => programInfoSubtitle.appendChild(s));

      programInfoWrap.appendChild(programInfoTitle);
      programInfoWrap.appendChild(programInfoSubtitle)
      programInfoWrap.appendChild(programInfoTopic)

      programTimeline.appendChild(programInfoWrap);

      // if (isActive) {
      //   programTimeline.childNodes;
      // }

      return programTimeline;
    });

  const tl = document.querySelector(".program-timeline-wrap");

  if (tl.hasChildNodes()) {
    tl.replaceChildren();
    activeSessions.forEach((el) => {
      tl.appendChild(el);
    });
  }
}
