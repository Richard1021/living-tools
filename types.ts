
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  sources: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}
