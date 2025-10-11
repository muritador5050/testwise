import QuestionService from '../services/questionService';
class QuestionController {
    static async create(req, res) {
        try {
            const { testId } = req.params;
            const questionData = req.body;
            if (!questionData.text || !questionData.questionType) {
                return res
                    .status(400)
                    .json({ error: 'Question text and type are required' });
            }
            const question = await QuestionService.createQuestion(parseInt(testId), questionData);
            res.status(201).json(question);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getByTest(req, res) {
        try {
            const { testId } = req.params;
            const questions = await QuestionService.getQuestionsByTest(parseInt(testId));
            res.json(questions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const question = await QuestionService.updateQuestion(parseInt(id), updateData);
            res.json(question);
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Question not found' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const questions = await QuestionService.getAllQuestions();
            res.json(questions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await QuestionService.deleteQuestion(parseInt(id));
            res.status(204).send();
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Question not found' });
            }
            res.status(500).json({ error: error.message });
        }
    }
}
export default QuestionController;
//# sourceMappingURL=questionController.js.map