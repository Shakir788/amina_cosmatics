// schemas/review.js — Sanity Studio mein add karo
export default {
  name: 'review',
  title: 'Avis Client',
  type: 'document',
  fields: [
    {
      name: 'productId',
      title: 'Produit (ID Sanity)',
      type: 'reference',
      to: [{ type: 'cosmeticProduct' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'customerName',
      title: 'Nom du client',
      type: 'string',
      validation: Rule => Rule.required().max(60),
    },
    {
      name: 'city',
      title: 'Ville',
      type: 'string',
    },
    {
      name: 'rating',
      title: 'Note (1-5)',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5),
    },
    {
      name: 'comment',
      title: 'Commentaire',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(500),
    },
    {
      name: 'approved',
      title: 'Approuvé ?',
      type: 'boolean',
      description: 'Cochez pour afficher sur le site',
      initialValue: false,
    },
    {
      name: 'createdAt',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'comment',
      rating: 'rating',
    },
    prepare({ title, subtitle, rating }) {
      return {
        title: `${'⭐'.repeat(rating)} ${title}`,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: 'Date (récent)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
};