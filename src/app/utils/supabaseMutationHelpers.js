export const requireMatchingMutationRow = (result = {}, expectedId = '', label = 'Kayıt') => {
  if (result?.error) throw result.error;

  if (!expectedId || result?.data?.id !== expectedId) {
    throw new Error(`${label} yazması doğrulanamadı`);
  }

  return result.data;
};
