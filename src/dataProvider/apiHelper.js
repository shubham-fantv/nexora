import fetcher from '../dataProvider/index';
import { API_BASE_URL } from '../constant/constants';

export const generateAudio = async (text) => {
  try {
    const response = await fetcher.post(`${API_BASE_URL}/v1/generate-song`, {
      prompt: text,
    });
    if (!response) throw new Error('Failed to create video');
    return response;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};
