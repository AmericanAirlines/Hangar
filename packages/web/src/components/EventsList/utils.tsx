import { z } from 'zod';
export interface Event {
  id: string;
  name: string;
  description: string;
  start: string;
  end: string;
}
  
export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  start: z.string(),
  end: z.string(),
});

export const eventStyle =  (badge:string) => ({
  color: badge!=='PAST'?'':'#666',
  padding: '8px' ,
  margin: '8px' ,
  listStyleType: 'none',
  border: '1px solid #444',
  borderRadius:'8px',
  background:badge!=='PAST'?'#222':'#111',
  filter: badge!=='PAST'?'':'blur(1px)',
})