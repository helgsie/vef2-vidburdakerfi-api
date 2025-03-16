import { Request, Response } from 'express';
import * as authService from '../services/authService.js';

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;

        // Staðfesting á innslegnum gögnum
        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Netfang, nafn og lykilorðs er krafist' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Lykilorð verður að innihalda 8+ stafi' });
        }

        // Staðfesting á sniði netfangs
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Rangt snið á netfangi' });
        }

        const user = await authService.signup(email, name, password);

        res.status(201).json({
            message: 'Nýskráning notanda tókst',
            user
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Netfang er þegar í notkun') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Villa við að stofna notandaaðgang' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Staðfesting á innslegnum gögnum
        if (!email || !password) {
            return res.status(400).json({ error: 'Innskráning krefst netfangs og lykilorðs' });
        }

        const result = await authService.login(email, password);

        res.status(200).json({
            message: 'Innskráning tókst',
            ...result
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid credentials') {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: 'Innskráning mistókst' });
    }
};