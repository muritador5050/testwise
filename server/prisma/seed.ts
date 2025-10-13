import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@testwise.com' },
    update: {},
    create: {
      email: 'admin@testwise.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Sample Students
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@testwise.com' },
    update: {},
    create: {
      email: 'student1@testwise.com',
      name: 'Alice Johnson',
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@testwise.com' },
    update: {},
    create: {
      email: 'student2@testwise.com',
      name: 'Bob Smith',
      role: 'STUDENT',
    },
  });
  console.log('✅ Sample students created');

  // Create a Sample Test
  const sampleTest = await prisma.test.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'JavaScript Fundamentals Quiz',
      description: 'Test your knowledge of JavaScript basics',
      duration: 30, // 30 minutes
      maxAttempts: 3,
      isPublished: true,
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });
  console.log('✅ Sample test created:', sampleTest.title);

  // Create Sample Questions
  const question1 = await prisma.question.create({
    data: {
      text: 'What is the correct way to declare a variable in JavaScript?',
      questionType: 'MULTIPLE_CHOICE',
      points: 1.0,
      order: 1,
      testId: sampleTest.id,
      options: {
        create: [
          { text: 'var myVar;', isCorrect: true, order: 1 },
          { text: 'variable myVar;', isCorrect: false, order: 2 },
          { text: 'v myVar;', isCorrect: false, order: 3 },
          { text: 'dim myVar;', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      text: 'Which of the following are valid JavaScript data types? (Select all that apply)',
      questionType: 'MULTIPLE_ANSWER',
      points: 2.0,
      order: 2,
      testId: sampleTest.id,
      options: {
        create: [
          { text: 'String', isCorrect: true, order: 1 },
          { text: 'Number', isCorrect: true, order: 2 },
          { text: 'Boolean', isCorrect: true, order: 3 },
          { text: 'Character', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  const question3 = await prisma.question.create({
    data: {
      text: 'JavaScript is a case-sensitive language.',
      questionType: 'TRUE_FALSE',
      points: 1.0,
      order: 3,
      testId: sampleTest.id,
      options: {
        create: [
          { text: 'True', isCorrect: true, order: 1 },
          { text: 'False', isCorrect: false, order: 2 },
        ],
      },
    },
  });

  const question4 = await prisma.question.create({
    data: {
      text: 'What does DOM stand for?',
      questionType: 'SHORT_ANSWER',
      points: 1.0,
      order: 4,
      testId: sampleTest.id,
    },
  });

  console.log('✅ Sample questions created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Login credentials:');
  console.log('   Admin: admin@testwise.com');
  console.log('   Student 1: student1@testwise.com');
  console.log('   Student 2: student2@testwise.com');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
