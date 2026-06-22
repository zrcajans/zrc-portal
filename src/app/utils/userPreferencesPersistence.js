export const upsertUserPreferencesForUser = (
  supabase,
  { workspaceId, userId, preferences, updatedAt }
) =>
  supabase
    .from('user_preferences')
    .upsert(
      {
        workspace_id: workspaceId,
        user_id: userId,
        preferences,
        updated_at: updatedAt
      },
      {
        onConflict: 'user_id'
      }
    );
