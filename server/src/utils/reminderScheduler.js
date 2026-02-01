import cron from 'node-cron';
import Task from '../models/Task.js';

const reminderScheduler = () => {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      const now = new Date();
      const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

      // Find tasks with reminders due in the next 15 minutes that haven't been sent
      const tasksWithReminders = await Task.find({
        reminderDate: {
          $gte: now,
          $lte: fifteenMinutesFromNow
        },
        reminderSent: false,
        status: { $ne: 'completed' }
      }).populate('categories', 'name color icon');

      for (const task of tasksWithReminders) {
        // Mark reminder as sent
        task.reminderSent = true;
        await task.save();

        // Log reminder (in production, this would send email/notification)
        console.log(`REMINDER: Task "${task.title}" is due on ${task.dueDate}`);
        console.log(`Priority: ${task.priority}, Status: ${task.status}`);
        console.log(`Categories: ${task.categories.map(c => c.name).join(', ')}`);
        console.log('---');
      }

      if (tasksWithReminders.length > 0) {
        console.log(`Processed ${tasksWithReminders.length} reminder(s) at ${now.toISOString()}`);
      }
    } catch (error) {
      console.error('Error in reminder scheduler:', error);
    }
  });

  console.log('Reminder scheduler initialized (runs every 15 minutes)');
};

export default reminderScheduler;
