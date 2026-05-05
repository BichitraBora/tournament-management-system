// backend/controllers/tournamentController.js
import Tournament from '../models/Tournament.js';

// @desc    Create a new tournament (with dynamic form schema)
// @route   POST /api/tournaments
// @access  Private / Organizer Only
export const createTournament = async (req, res) => {
    try {
        const { title, description, category, startDate, joiningFee, prizeAmount, registrationFormSchema, bannerImage } = req.body;

        const tournament = await Tournament.create({
            organizerId: req.user._id, // We get this from the 'protect' middleware!
            title,
            description,
            category,
            startDate,
            joiningFee,
            prizeAmount,
            bannerImage,
            registrationFormSchema
        });

        res.status(201).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all active tournaments
// @route   GET /api/tournaments
// @access  Public (Anyone can browse tournaments)
export const getTournaments = async (req, res) => {
    try {
        // Find tournaments where isActive is true
        // populate() replaces the organizerId string with the actual Organizer's name and email
        const tournaments = await Tournament.find({ isActive: true })
            .populate('organizerId', 'name email'); 
            
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a tournament
// @route   PUT /api/tournaments/:id
// @access  Private / Organizer Only
export const updateTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Make sure the logged-in user is the one who created this tournament
        if (tournament.organizerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this tournament' });
        }

        // Update the document with new data
        const updatedTournament = await Tournament.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Returns the updated document
        );

        res.status(200).json(updatedTournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a tournament
// @route   DELETE /api/tournaments/:id
// @access  Private / Organizer Only
export const deleteTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        if (tournament.organizerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this tournament' });
        }

        await tournament.deleteOne();

        res.status(200).json({ message: 'Tournament removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};