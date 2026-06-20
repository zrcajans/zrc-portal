const normalizeRelationshipIds = (values = []) =>
  Array.from(
    new Set(
      (Array.isArray(values) ? values : [])
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    )
  );

export const buildRelationshipSyncPlan = (existingIds = [], desiredIds = []) => {
  const existing = normalizeRelationshipIds(existingIds);
  const desired = normalizeRelationshipIds(desiredIds);
  const existingSet = new Set(existing);
  const desiredSet = new Set(desired);

  return {
    toInsert: desired.filter((id) => !existingSet.has(id)),
    toDelete: existing.filter((id) => !desiredSet.has(id))
  };
};
