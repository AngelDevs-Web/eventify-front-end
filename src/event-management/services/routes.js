/**
 * @fileoverview Routes configuration for events
 * @module eventRoutes
 */

// Routes for events module
export const eventRoutes = {
    // List events
    list: '/events',

    // Get event by ID
    detail: id => `/events/${id}`,

    // Create event
    create: '/events/create',

    // Edit event
    edit: id => `/events/${id}/edit`
};