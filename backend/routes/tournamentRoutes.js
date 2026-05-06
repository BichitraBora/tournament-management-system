// backend/routes/tournamentRoutes.js
import express from 'express';
import { createTournament, getTournaments, updateTournament, deleteTournament } from '../controllers/tournamentController.js';

import { registerForTournament, getTournamentRegistrations, updateRegistrationStatus, getMyRegistrations } from '../controllers/registrationController.js';

import { protect, organizerOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getTournaments)
    .post(protect, organizerOnly, createTournament);

router.route('/my/registrations')
    .get(protect, getMyRegistrations);


// Registration routes attached to a specific tournament ID
router.route('/:tournamentId/register')
    .post(protect, registerForTournament);

router.route('/:tournamentId/registrations')
    .get(protect, organizerOnly, getTournamentRegistrations);

// Route to approve/reject a specific registration
router.route('/:tournamentId/registrations/:registrationId')
    .patch(protect, organizerOnly, updateRegistrationStatus);

// Routes for a specific tournament ID
router.route('/:id')
    .put(protect, organizerOnly, updateTournament)
    .delete(protect, organizerOnly, deleteTournament);

export default router;