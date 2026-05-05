// backend/routes/tournamentRoutes.js
import express from 'express';
import { createTournament, getTournaments, updateTournament, deleteTournament } from '../controllers/tournamentController.js';
import { registerForTournament, getTournamentRegistrations, updateRegistrationStatus } from '../controllers/registrationController.js';
import { protect, organizerOnly } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Existing routes
router.route('/')
    .get(getTournaments)
    .post(protect, organizerOnly, createTournament);

// Registration routes attached to a specific tournament ID
router.route('/:tournamentId/register')
    .post(protect, registerForTournament); // Any logged-in user can register

router.route('/:tournamentId/registrations')
    .get(protect, organizerOnly, getTournamentRegistrations); // Only the organizer can view

// NEW: Route to approve/reject a specific registration
// Notice it requires the tournamentId AND the specific registrationId in the URL
router.route('/:tournamentId/registrations/:registrationId')
    .patch(protect, organizerOnly, updateRegistrationStatus);

// NEW: Routes for a specific tournament ID
router.route('/:id')
    .put(protect, organizerOnly, updateTournament)
    .delete(protect, organizerOnly, deleteTournament);

export default router;