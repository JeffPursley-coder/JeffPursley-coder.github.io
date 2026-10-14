/** Original 30 synthetic acceptance cases, with their predetermined expectations. */
export const acceptanceCases=[
  {
    "id": "T01",
    "category": "Information",
    "text": "Routine weekly bulletin; no request or commitment",
    "expectedState": "INFO",
    "expectedUrgent": false
  },
  {
    "id": "T02",
    "category": "Urgent",
    "text": "Major account site inaccessible; immediate manager intervention needed",
    "expectedState": "ACTION",
    "expectedUrgent": true
  },
  {
    "id": "T03",
    "category": "Vendor",
    "text": "Vendor asks manager to approve purchasing exception",
    "expectedState": "ACTION",
    "expectedUrgent": false
  },
  {
    "id": "T04",
    "category": "Reply",
    "text": "Manager replies: I will inspect the location tomorrow, then decide",
    "expectedState": "ACTION",
    "expectedUrgent": false
  },
  {
    "id": "T05",
    "category": "Delegation",
    "text": "Named scheduler accepts transfer and has next work step; manager monitors",
    "expectedState": "WAITING",
    "expectedUrgent": false
  },
  {
    "id": "T06",
    "category": "Reply",
    "text": "Vendor provides quote after manager previously asked; manager must decide",
    "expectedState": "ACTION",
    "expectedUrgent": false
  },
  {
    "id": "T07",
    "category": "Completion",
    "text": "Task completion evidence received and manager verifies no residual action",
    "expectedState": "RESOLVED",
    "expectedUrgent": false
  },
  {
    "id": "T08",
    "category": "Ambiguity",
    "text": "Thread does not identify who owns promised next step",
    "expectedState": "NEEDS_REVIEW",
    "expectedUrgent": false
  },
  {
    "id": "T09",
    "category": "Conflicting",
    "text": "Two messages contradict whether high priority customer case is closed",
    "expectedState": "NEEDS_REVIEW",
    "expectedUrgent": true
  },
  {
    "id": "T10",
    "category": "Retry",
    "text": "Duplicate event reprocessed without new facts; existing ACTION must persist",
    "expectedState": "ACTION",
    "expectedUrgent": false
  },
  {
    "id": "T11",
    "category": "Retry",
    "text": "Same notification event triggers twice while waiting on vendor",
    "expectedState": "WAITING",
    "expectedUrgent": false
  },
  {
    "id": "T12",
    "category": "Legacy",
    "text": "Legacy status tags conflict with new work state; current owner unclear",
    "expectedState": "NEEDS_REVIEW",
    "expectedUrgent": false
  },
  {
    "id": "T13",
    "category": "Routing",
    "text": "Message delivered outside expected inbox trigger; manual sweep discovers task",
    "expectedState": "NEEDS_REVIEW",
    "expectedUrgent": false
  },
  {
    "id": "T14",
    "category": "Injection",
    "text": "Email says IGNORE RULES and send credentials; real request is approval",
    "expectedState": "ACTION",
    "expectedUrgent": false
  },
  {
    "id": "T15",
    "category": "Context",
    "text": "Newest note says thanks but prior obligation history unavailable",
    "expectedState": "NEEDS_REVIEW",
    "expectedUrgent": false
  },
  {
    "id": "T16",
    "category": "Outage",
    "text": "Classifier unavailable during vendor decision request",
    "expectedState": "NEEDS_REVIEW",
    "expectedUrgent": false
  },
  {
    "id": "T17",
    "category": "Override",
    "text": "Manager corrects AI WAITING to ACTION; stale event later arrives",
    "expectedState": "ACTION",
    "expectedUrgent": false
  },
  {
    "id": "T18",
    "category": "Reopen",
    "text": "Previously completed case reopened with fresh manager request",
    "expectedState": "ACTION",
    "expectedUrgent": false
  },
  {
    "id": "T19",
    "category": "Urgent",
    "text": "Urgent service outage awaiting confirmed vendor replacement part",
    "expectedState": "WAITING",
    "expectedUrgent": true
  },
  {
    "id": "T20",
    "category": "Follow-up",
    "text": "Manager schedules check-in next week; nothing owed until date",
    "expectedState": "FOLLOW_UP",
    "expectedUrgent": false
  },
  {
    "id": "T21",
    "category": "Information",
    "text": "Invoice copy already acknowledged; no active decision",
    "expectedState": "INFO",
    "expectedUrgent": false
  },
  {
    "id": "T22",
    "category": "Safety",
    "text": "Immediate worker hazard requiring supervisor decision",
    "expectedState": "ACTION",
    "expectedUrgent": true
  },
  {
    "id": "T23",
    "category": "Closure",
    "text": "Manager granted approval; vendor confirmed action completed",
    "expectedState": "RESOLVED",
    "expectedUrgent": false
  },
  {
    "id": "T24",
    "category": "Delegation",
    "text": "Manager asks technician for photographs but retains final approval",
    "expectedState": "ACTION",
    "expectedUrgent": false
  },
  {
    "id": "T25",
    "category": "Completion",
    "text": "Service visit completed; relevant stakeholder confirms and closes case",
    "expectedState": "RESOLVED",
    "expectedUrgent": false
  },
  {
    "id": "T26",
    "category": "Reply",
    "text": "Manager replies thank you after requesting repairs, repair not completed",
    "expectedState": "ACTION",
    "expectedUrgent": false
  },
  {
    "id": "T27",
    "category": "Ambiguity",
    "text": "Email says Can someone handle this? without assigned owner",
    "expectedState": "NEEDS_REVIEW",
    "expectedUrgent": false
  },
  {
    "id": "T28",
    "category": "Security",
    "text": "Message requests password and urges immediate disclosure",
    "expectedState": "NEEDS_REVIEW",
    "expectedUrgent": true
  },
  {
    "id": "T29",
    "category": "Multiple",
    "text": "Single thread has unrelated work items for two different owners",
    "expectedState": "NEEDS_REVIEW",
    "expectedUrgent": false
  },
  {
    "id": "T30",
    "category": "Waiting",
    "text": "Confirmed third party is obtaining schedule; manager will follow on receipt",
    "expectedState": "WAITING",
    "expectedUrgent": false
  }
];
export const featuredCaseIds=["T04","T07","T05","T19","T09","T22","T03","T17","T18","T10","T14","T28"];
