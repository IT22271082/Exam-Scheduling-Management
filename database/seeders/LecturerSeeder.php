<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class LecturerSeeder extends Seeder
{
    public function run()
    {
        $lecturers = [
            [
                'name' => 'John Doe',
                'email' => 'johndoe@example.com',
                'phone' => '1234567890',
                'department' => 'Computer Science',
                'qualification' => 'PhD in Computer Science',
                'bio' => 'Experienced lecturer with expertise in algorithms and data structures.',
                'type' => 'Senior',
                'lecturer_id' => 'SEN-001',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'janesmith@example.com',
                'phone' => '0987654321',
                'department' => 'Software Engineering',
                'qualification' => 'MSc in Software Engineering',
                'bio' => 'Passionate about teaching software design principles.',
                'type' => 'Junior',
                'lecturer_id' => 'JUN-001',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Michael Johnson',
                'email' => 'michael.johnson@example.com',
                'phone' => '555-123-4567',
                'department' => 'Information Technology (IT)',
                'qualification' => 'MSc in Information Technology',
                'bio' => 'Focuses on network security and system administration.',
                'type' => 'Senior',
                'lecturer_id' => 'SEN-003',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Emily Brown',
                'email' => 'emily.brown@example.com',
                'phone' => '444-321-7890',
                'department' => 'Artificial Intelligence (AI)',
                'qualification' => 'PhD in Artificial Intelligence',
                'bio' => 'Researches deep learning and natural language processing.',
                'type' => 'Senior',
                'lecturer_id' => 'SEN-004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'David White',
                'email' => 'david.white@example.com',
                'phone' => '333-987-6543',
                'department' => 'Cybersecurity',
                'qualification' => 'MSc in Cybersecurity',
                'bio' => 'Specializes in ethical hacking and digital forensics.',
                'type' => 'Junior',
                'lecturer_id' => 'JUN-005',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sophia Green',
                'email' => 'sophia.green@example.com',
                'phone' => '222-678-1234',
                'department' => 'Data Science',
                'qualification' => 'MSc in Data Science',
                'bio' => 'Passionate about data analysis and predictive modeling.',
                'type' => 'Junior',
                'lecturer_id' => 'JUN-006',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'James Taylor',
                'email' => 'james.taylor@example.com',
                'phone' => '111-234-5678',
                'department' => 'Computer Science (CS)',
                'qualification' => 'PhD in Machine Learning',
                'bio' => 'Researching reinforcement learning and autonomous systems.',
                'type' => 'Senior',
                'lecturer_id' => 'SEN-007',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Olivia Harris',
                'email' => 'olivia.harris@example.com',
                'phone' => '555-987-6543',
                'department' => 'Software Engineering',
                'qualification' => 'MSc in Software Engineering',
                'bio' => 'Focused on Agile methodologies and software testing.',
                'type' => 'Junior',
                'lecturer_id' => 'JUN-008',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'William Martinez',
                'email' => 'william.martinez@example.com',
                'phone' => '666-543-8765',
                'department' => 'Information Technology (IT)',
                'qualification' => 'PhD in Information Systems',
                'bio' => 'Researches IT management and cloud computing.',
                'type' => 'Senior',
                'lecturer_id' => 'SEN-009',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Isabella Lee',
                'email' => 'isabella.lee@example.com',
                'phone' => '777-654-3210',
                'department' => 'Artificial Intelligence (AI)',
                'qualification' => 'MSc in Robotics',
                'bio' => 'Working on AI for robotics and autonomous vehicles.',
                'type' => 'Senior',
                'lecturer_id' => 'SEN-010',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        
        ];

        DB::table('lecturers')->insert($lecturers);
    }
}

