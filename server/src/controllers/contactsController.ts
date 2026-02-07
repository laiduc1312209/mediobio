import { Response } from 'express';
import { contactQueries, profileQueries } from '../models/queries';
import { emergencyContactSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';

// Get all emergency contacts
export async function getContacts(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        // Find medical profile
        const profile = await profileQueries.findProfileByUserId(userId);
        if (!profile) {
            res.status(404).json({ error: 'Medical profile not found' });
            return;
        }

        const contacts = await contactQueries.findContactsByProfileId(profile.id);

        res.json({ contacts });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ error: 'Failed to get contacts' });
    }
}

// Create emergency contact
export async function createContact(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        // Find medical profile
        const profile = await profileQueries.findProfileByUserId(userId);
        if (!profile) {
            res.status(404).json({ error: 'Medical profile not found. Please create one first.' });
            return;
        }

        const validatedData = emergencyContactSchema.parse(req.body);

        const contact = await contactQueries.createContact({
            medicalProfileId: profile.id,
            name: validatedData.name,
            relationship: validatedData.relationship,
            phone: validatedData.phone,
            email: validatedData.email,
            priority: validatedData.priority || 1,
        });

        res.status(201).json({
            message: 'Emergency contact created successfully',
            contact,
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Create contact error:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
}

// Update emergency contact
export async function updateContact(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        const { contactId } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const validatedData = emergencyContactSchema.partial().parse(req.body);

        const updatedContact = await contactQueries.updateContact(contactId, validatedData);

        res.json({
            message: 'Contact updated successfully',
            contact: updatedContact,
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Update contact error:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
}

// Delete emergency contact
export async function deleteContact(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        const { contactId } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        await contactQueries.deleteContact(contactId);

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
}
