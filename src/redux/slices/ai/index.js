// redux/slices/pageDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tools: {
    muzicai: {
      id: 'muzic-ai',
      name: 'MUSIC AI',
      description: 'Music Description',
      maxChars: 200,
      placeholder:
        'Describe the style of music and the topic you want, AI will generate music for you',
    },
    scriptgen: {
      id: 'articulate-ai',
      name: 'SCRIPT GEN',
      description: 'Lyrics Description',
      maxChars: 200,
      placeholder: 'Describe your script requirements',
    },
    vdioai: {
      id: 'cinematic-ai',
      name: 'VDIO AI',
      description: 'Video Description',
      maxChars: 200,
      placeholder: 'Describe your video concept',
    },
  },
};

const aiToolsSlice = createSlice({
  name: 'aiTools',
  initialState,
  reducers: {},
});

export default aiToolsSlice.reducer;
