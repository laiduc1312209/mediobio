import { Router } from 'express';
import { getContacts, createContact, updateContact, deleteContact } from '../controllers/contactsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getContacts);
router.post('/', createContact);
router.put('/:contactId', updateContact);
router.delete('/:contactId', deleteContact);

export default router;
