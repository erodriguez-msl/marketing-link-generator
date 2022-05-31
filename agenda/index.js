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
    ({ date }) => date.getDay() == mockTime.getDay()
  )[0].sessions;

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
          if (startTime > mockTime ) {
            return false;
          } else {
            return true
          }
        } 
      }

      //END TIME FUNCTIONS

      const programTimeline = document.createElement("ul");
      programTimeline.className = "program-timeline";
      isActive ? programTimeline.classList.add("current") : null;
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
        ? `<span>${
            startTime.split(" ")[0]
          }<span style="font-size: 14px; margin-left: 4px">${
            startTime.split(" ")[1]
          }</span></span>`
        : "";

      programTimeline.appendChild(programSchedule);
      isActive ? programTimeline.classList.add("current") : null;

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
      programInfoTopic.innerText = session.topic ? session.topic : null;

      const timeSpan = document.createElement("div");

      timeSpan.className = "time-span";
      timeSpan.textContent = `Ends at: ${endTime}`;

      const statusChip = document.createElement('li')
      statusChip.innerText = 'In Progress'
      statusChip.className = 'status-chip'
      
      !isActive && session.startTime < mockTime ? timeSpan.appendChild(statusChip) : null

      programInfoTopic.appendChild(timeSpan);

      session.topic ? programInfoTitle.appendChild(programInfoTopic) : null;

      isActive ? programInfoTitle.classList.add("enlarged") : null;

      const programInfoWrapper = document.createElement("div");
      programInfoWrapper.className = "program-info-wrapper";

      const programInfoSubtitle = document.createElement("div");
      programInfoSubtitle.className = "program-info-subtitle";
      programInfoWrapper.appendChild(programInfoSubtitle);

      const speakers = session.speaker.map((sp) => {
        const speakerContainer = document.createElement("div");
        speakerContainer.className = "speaker-container";

        const speakerImage = document.createElement("img");
        speakerImage.className = "program-speaker-avatar";
        isActive ? speakerImage.classList.add("enlarged-img") : null;

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
      programInfoWrap.appendChild(programInfoSubtitle);

      programTimeline.appendChild(programInfoWrap);

      if (isActive) {
        programTimeline.childNodes;
      }

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
