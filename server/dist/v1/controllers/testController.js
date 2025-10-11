import TestService from '../services/testService';
class TestController {
    static async create(req, res) {
        try {
            const testData = req.body;
            if (!testData.title || !testData.duration) {
                return res
                    .status(400)
                    .json({ error: 'Title and duration are required' });
            }
            const test = await TestService.createTest(testData);
            res.status(201).json(test);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const includeAnswers = req.query.includeAnswers === 'true';
            const test = await TestService.getTestById(parseInt(id), includeAnswers);
            if (!test) {
                return res.status(404).json({ error: 'Test not found' });
            }
            res.json(test);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const isPublished = req.query.published
                ? req.query.published === 'true'
                : undefined;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await TestService.getAllTests(isPublished, page, limit);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const test = await TestService.updateTest(parseInt(id), updateData);
            res.json(test);
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Test not found' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async publish(req, res) {
        try {
            const { id } = req.params;
            const test = await TestService.publishTest(parseInt(id));
            res.json(test);
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Test not found' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async checkAvailability(req, res) {
        try {
            const { id } = req.params;
            const availability = await TestService.isTestAvailable(parseInt(id));
            if (!availability.available) {
                return res.status(400).json({ error: availability.reason });
            }
            res.json({ available: true });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await TestService.deleteTest(parseInt(id));
            res.status(204).send();
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Test not found' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async getStatistics(req, res) {
        try {
            const stats = await TestService.getAllTestsStatistics();
            res.json(stats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
export default TestController;
//# sourceMappingURL=testController.js.map