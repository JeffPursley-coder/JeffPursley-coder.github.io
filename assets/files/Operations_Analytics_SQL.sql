-- Juniper Vale Operations Analytics | SQL Query Pack
-- Scenario data for the portfolio project.

-- ===== Q01_KPI_Summary.sql =====
WITH order_kpis AS (
 SELECT PeriodType, ReviewWindow,
        COUNT(*) AS Orders,
        AVG(CAST(IntakeCompleteFlag AS REAL)) AS SchedulableIntakeCompleteness,
        AVG(CAST(InventoryDelayFlag AS REAL)) AS InventoryDelayRate,
        AVG(CAST(CloseoutCompleteFlag AS REAL)) AS CloseoutCompleteness,
        SUM(CASE WHEN FollowUpRequiredFlag='1' THEN 1 ELSE 0 END) AS FollowUps,
        AVG(CASE WHEN FollowUpRequiredFlag='1' THEN CAST(FollowUpSLAMetFlag AS REAL) END) AS FollowUpSLAAttainment
 FROM FactServiceOrder GROUP BY PeriodType, ReviewWindow
), appt_kpis AS (
 SELECT PeriodType, ReviewWindow,
        AVG(CAST(InvalidAssignmentFlag AS REAL)) AS InvalidAssignmentRate,
        AVG(CAST(PostPublishChangeFlag AS REAL)) AS PostPublishRouteChangeRate,
        AVG(CAST(CapacityStatusCapturedFlag AS REAL)) AS CapacityStatusCoverage
 FROM FactAppointment GROUP BY PeriodType, ReviewWindow
), rpt AS (
 SELECT PeriodType, ReviewWindow, AVG(CAST(PreparationHours AS REAL)) AS ReportingPrepHours
 FROM FactWeeklyReporting GROUP BY PeriodType, ReviewWindow
)
SELECT o.*, a.InvalidAssignmentRate,a.PostPublishRouteChangeRate,a.CapacityStatusCoverage,r.ReportingPrepHours
FROM order_kpis o JOIN appt_kpis a USING(PeriodType,ReviewWindow)
LEFT JOIN rpt r USING(PeriodType,ReviewWindow)
ORDER BY CASE WHEN o.PeriodType='Baseline' THEN 0 ELSE 1 END,
         CASE o.ReviewWindow WHEN '30-Day' THEN 1 WHEN '60-Day' THEN 2 WHEN '90-Day' THEN 3 ELSE 0 END;

-- ===== Q02_Route_Change_Drivers.sql =====
SELECT PeriodType, ReviewWindow, PostPublishChangeReason AS Reason, COUNT(*) AS Changes
FROM FactAppointment
WHERE PostPublishChangeFlag='1'
GROUP BY PeriodType, ReviewWindow, PostPublishChangeReason
ORDER BY PeriodType, ReviewWindow, Changes DESC;

-- ===== Q03_Invalid_Assignment_By_Territory.sql =====
SELECT a.PeriodType,a.ReviewWindow,t.TerritoryName,
       COUNT(*) AS Appointments,
       SUM(CAST(a.InvalidAssignmentFlag AS INTEGER)) AS InvalidAssignments,
       AVG(CAST(a.InvalidAssignmentFlag AS REAL)) AS InvalidRate
FROM FactAppointment a JOIN DimTerritory t ON a.TerritoryCode=t.TerritoryCode
GROUP BY a.PeriodType,a.ReviewWindow,t.TerritoryName
ORDER BY a.PeriodType,a.ReviewWindow,InvalidRate DESC;

-- ===== Q04_Inventory_Delay_By_Service.sql =====
SELECT o.PeriodType,o.ReviewWindow,s.ServiceName,
       COUNT(*) AS Orders,
       SUM(CAST(o.InventoryDelayFlag AS INTEGER)) AS InventoryDelays,
       AVG(CAST(o.InventoryDelayFlag AS REAL)) AS InventoryDelayRate
FROM FactServiceOrder o JOIN DimServiceType s ON o.ServiceTypeID=s.ServiceTypeID
GROUP BY o.PeriodType,o.ReviewWindow,s.ServiceName
ORDER BY o.PeriodType,o.ReviewWindow,InventoryDelayRate DESC;

-- ===== Q05_Closeout_By_Service.sql =====
SELECT o.PeriodType,o.ReviewWindow,s.ServiceName,
       COUNT(*) AS Orders,
       AVG(CAST(o.CloseoutCompleteFlag AS REAL)) AS CloseoutCompleteness
FROM FactServiceOrder o JOIN DimServiceType s ON o.ServiceTypeID=s.ServiceTypeID
GROUP BY o.PeriodType,o.ReviewWindow,s.ServiceName
ORDER BY o.PeriodType,o.ReviewWindow,CloseoutCompleteness ASC;

-- ===== Q06_FollowUp_SLA.sql =====
SELECT PeriodType,ReviewWindow,FollowUpType,
       COUNT(*) AS FollowUps,
       AVG(CAST(FollowUpSLAMetFlag AS REAL)) AS SLAAttainment
FROM FactServiceOrder
WHERE FollowUpRequiredFlag='1'
GROUP BY PeriodType,ReviewWindow,FollowUpType
ORDER BY PeriodType,ReviewWindow,SLAAttainment ASC;

-- ===== Q07_Capacity_Coverage_By_Territory.sql =====
SELECT a.PeriodType,a.ReviewWindow,t.TerritoryName,
       COUNT(*) AS Appointments,
       AVG(CAST(a.CapacityStatusCapturedFlag AS REAL)) AS CapacityCoverage,
       SUM(CASE WHEN a.CapacityState='NEAR LIMIT' THEN 1 ELSE 0 END) AS NearLimit,
       SUM(CASE WHEN a.CapacityState='OVER CAPACITY' THEN 1 ELSE 0 END) AS OverCapacity
FROM FactAppointment a JOIN DimTerritory t ON a.TerritoryCode=t.TerritoryCode
GROUP BY a.PeriodType,a.ReviewWindow,t.TerritoryName
ORDER BY a.PeriodType,a.ReviewWindow,t.TerritoryName;

-- ===== Q08_Reservice_By_Service.sql =====
SELECT o.PeriodType,o.ReviewWindow,s.ServiceName,
       COUNT(*) AS Orders,
       AVG(CAST(o.ReServiceFlag AS REAL)) AS ReServiceRate
FROM FactServiceOrder o JOIN DimServiceType s ON o.ServiceTypeID=s.ServiceTypeID
GROUP BY o.PeriodType,o.ReviewWindow,s.ServiceName
ORDER BY o.PeriodType,o.ReviewWindow,ReServiceRate DESC;

-- ===== Q09_Reporting_Prep_Trend.sql =====
SELECT PeriodType,ReviewWindow,WeekStart,CAST(PreparationHours AS REAL) AS PreparationHours
FROM FactWeeklyReporting
ORDER BY WeekStart;

-- ===== Q10_Action_Exceptions_90Day.sql =====
SELECT a.TerritoryCode,
       SUM(CAST(a.PostPublishChangeFlag AS INTEGER)) AS RouteChanges,
       SUM(CAST(a.InvalidAssignmentFlag AS INTEGER)) AS InvalidAssignments,
       SUM(CASE WHEN a.CapacityState='OVER CAPACITY' THEN 1 ELSE 0 END) AS OverCapacityAppointments
FROM FactAppointment a
WHERE a.PeriodType='PostLaunch' AND a.ReviewWindow='90-Day'
GROUP BY a.TerritoryCode
ORDER BY RouteChanges DESC, InvalidAssignments DESC;

