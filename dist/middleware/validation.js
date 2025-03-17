import { ValidationError } from './errorHandler.js';
// Staðfesta snið á netfangi
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// Staðfesta styrkleika lykilorðs
export const isStrongPassword = (password) => {
    // Að minnsta kosti 8 stafir, inniheldur amk einn hástaf, einn lágstaf, og einn tölustaf
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};
// Staðfesta innskráningarbeiðni
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ValidationError("Nauðsynlegt er að slá inn netfang og lykilorð");
    }
    if (!isValidEmail(email)) {
        throw new ValidationError("Rangt sniðmát á netfangi");
    }
    next();
};
// Staðfesta nýskráningarbeiðni
export const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ValidationError("Nauðsynlegt er að slá inn nafn, netfang og lykilorð");
    }
    if (name.trim().length < 2) {
        throw new ValidationError("Nafn verður að vera að minnsta kosti 2 stafir að lengd");
    }
    if (!isValidEmail(email)) {
        throw new ValidationError("Rangt sniðmát á netfangi");
    }
    if (!isStrongPassword(password)) {
        throw new ValidationError("Lykilorð verður að innihalda að minnsta kosti 8 stafi, þar á meðal hástafi, lágstafi, og tölustafi");
    }
    next();
};
// Staðfesta stofnun viðburðar
export const validateCreateEvent = (req, res, next) => {
    const { titleEn, titleIs, start, end } = req.body;
    // Krafa er um að minnsta kosti einn titil (á íslensku eða ensku)
    if (!titleEn && !titleIs) {
        throw new ValidationError("Viðburður þarf að minnsta kosti einn titil (á íslensku eða ensku)");
    }
    // Staðfesta dagsetningar ef við á
    if (start && !isValidDate(start)) {
        throw new ValidationError("Rangt sniðmát á upphafsdagsetningu");
    }
    if (end && !isValidDate(end)) {
        throw new ValidationError("Rangt sniðmát á lokadagsetningu");
    }
    // Ef báðar dagsetningar eru gefnar, passa að lokadagur sé á eftir upphafsdegi
    if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (endDate <= startDate) {
            throw new ValidationError("Lokadagsetning verður að vera á eftir upphafsdagsetningu");
        }
    }
    next();
};
// Staðfesta uppfærslu á viðburði
export const validateUpdateEvent = (req, res, next) => {
    const { start, end } = req.body;
    // Staðfesta dagsetningar ef við á
    if (start && !isValidDate(start)) {
        throw new ValidationError("Rangt sniðmát á upphafsdagsetningu");
    }
    if (end && !isValidDate(end)) {
        throw new ValidationError("Rangt sniðmát á lokadagsetningu");
    }
    // Ef báðar dagsetningar eru gefnar, passa að lokadagur sé á eftir upphafsdegi
    if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (endDate <= startDate) {
            throw new ValidationError("Lokadagsetning verður að vera á eftir upphafsdagsetningu");
        }
    }
    next();
};
// Hjálparfall til að staðfesta sniðmát á dagsetningu
function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}
// Staðfesta gestalista
export const validateAttendEvent = (req, res, next) => {
    const { eventId } = req.params;
    if (!eventId || isNaN(parseInt(eventId))) {
        throw new ValidationError("Viðburður þarf gilt ID");
    }
    next();
};
// Staðfesta uppfærslu á prófíl
export const validateUpdateProfile = (req, res, next) => {
    const { name, email } = req.body;
    // Að minnsta kosti einn reitur verður að vera fylltur
    if (!name && !email) {
        throw new ValidationError("Gefa þarf upp annað hvort nafn eða netfang");
    }
    // Staðfesta nafn ef við á
    if (name !== undefined && name.trim().length < 2) {
        throw new ValidationError("Nafn verður að vera að minnsta kosti tveir stafir að lengd");
    }
    // Staðfesta netfang ef gefið er
    if (email !== undefined && !isValidEmail(email)) {
        throw new ValidationError("Rangt sniðmót á netfangi");
    }
    next();
};
// Hreinsa inntak til að koma í veg fyrir XSS árásir
export const sanitizeBody = (req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                // <script> tög fjarlægð
                req.body[key] = req.body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            }
        }
    }
    next();
};
//# sourceMappingURL=validation.js.map