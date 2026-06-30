import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url'; // ✨ Naya Import

export const client = createClient({
  projectId: 'sk9drqx3',
  dataset: 'production', 
  apiVersion: '2024-06-29', 
  useCdn: false, 
});

const builder = createImageUrlBuilder(client);

export const urlFor = (source) => {
  return builder.image(source);
};