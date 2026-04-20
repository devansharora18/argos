import { Request, Response } from 'express';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole, requireVenueScope } from '../../auth/roleGuard';
import { TelemetrySummaryQuery, TelemetrySummaryResponse } from '../../contracts/api/device';
import { telemetryRepo } from '../../repositories/telemetryRepo';

export async function getTelemetrySummaryHandler(
  req: Request,
  res: Response<TelemetrySummaryResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['staff', 'manager', 'admin']);

  const venueId = req.params.venueId;
  requireVenueScope(actor, venueId);

  const query = req.query as unknown as TelemetrySummaryQuery;
  const summaries = await telemetryRepo.listSummaries(venueId, {
    floor: query.floor,
    sensorType: query.sensor_type,
    limit: query.limit,
  });

  res.status(200).json({
    venue_id: venueId,
    summaries: summaries.map(summary => ({
      floor: summary.floor,
      sensor_type: summary.sensor_type,
      sample_count: summary.sample_count,
      avg_value: summary.sample_count > 0 ? summary.total_value / summary.sample_count : 0,
      max_value: summary.max_value,
      last_value: summary.last_value,
      last_seen_at: summary.last_seen_at,
    })),
  });
}
