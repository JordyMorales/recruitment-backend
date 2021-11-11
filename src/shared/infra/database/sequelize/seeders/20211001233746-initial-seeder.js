const runner = require('../runner');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const USERS = () =>
      queryInterface.bulkInsert(
        'user',
        [
          {
            user_id: '52b65e08-cb03-4251-a674-3462e84cf843',
            first_name: 'Jordy',
            last_name: 'Morales',
            email: 'dev.morales.jordy@gmail.com',
            role: 'ADMIN',
            state: 'ACTIVE',
          },
        ],
        {},
      );

    const TAGS = () =>
      queryInterface.bulkInsert(
        'tag',
        [
          {
            tag_id: '08e08ba3-91d0-49ad-ae30-3797d95ef48a',
            name: 'Direct Contact',
            color: '#e9db31',
            is_active: true,
          },
          {
            tag_id: 'c2b29d6e-de73-4f7b-b986-65475cb8d56e',
            name: 'LATAM',
            color: '#cf8843',
            is_active: true,
          },
          {
            tag_id: '3a8477c9-a026-4a29-93b3-3a9a99e03411',
            name: 'Application',
            color: '#f77fff',
            is_active: true,
          },
          {
            tag_id: '4ff3de94-aa5a-485f-ab70-e0d9557c277e',
            name: 'No action required',
            color: '#a1a382',
            is_active: true,
          },
          {
            tag_id: '40e2196b-f228-40fc-b7fb-944c854504cb',
            name: 'Project Management',
            color: '#77f864',
            is_active: true,
          },
          {
            tag_id: 'beae61b5-bd6e-460d-a46e-95f28c93a2a8',
            name: 'Referral',
            color: '#801e0b',
            is_active: true,
          },
          {
            tag_id: 'daaeaf0f-9e50-4c62-a72b-83b47191b2ac',
            name: 'External Referral',
            color: '#07c624',
            is_active: true,
          },
          {
            tag_id: '90a7ae7b-5191-48a2-9353-eb0fbca74f3a',
            name: 'Traceable Exp',
            color: '#7c0149',
            is_active: true,
          },
          {
            tag_id: 'ceb2d643-cb9e-48d5-98d7-6a1922e16394',
            name: 'Trainee',
            color: '#a8a747',
            is_active: true,
          },
          {
            tag_id: '1ad0b93f-5000-4415-b691-2fb70a36ba39',
            name: 'Notified',
            color: '#2f6ff7',
            is_active: true,
          },
          {
            tag_id: 'd059c603-ec2b-4700-8753-5627aee82fe7',
            name: 'Certifications',
            color: '#bd125b',
            is_active: true,
          },
          {
            tag_id: 'd4e3e340-5c64-4adf-b5a6-81996fb092ae',
            name: 'International Exp',
            color: '#f1be6c',
            is_active: true,
          },
          {
            tag_id: '60a0da08-4f3e-4c3b-a87d-39aa525bb5dd',
            name: 'Leadership Exp',
            color: '#375c1d',
            is_active: true,
          },
          {
            tag_id: 'fe55a0ca-786b-4a2f-8f8b-552c54262775',
            name: 'Internship Applicant',
            color: '#052a79',
            is_active: true,
          },
          {
            tag_id: 'fcae5504-f310-4396-81c8-319d56cf8951',
            name: 'Need Info',
            color: '#cbb4c2',
            is_active: true,
          },
          {
            tag_id: 'bedfb33a-4d79-4fb8-899c-5c6218e8c75a',
            name: 'Waiting Approval (Client)',
            color: '#5012ee',
            is_active: true,
          },
        ],
        {},
      );
    const TECHNOLOGIES = () =>
      queryInterface.bulkInsert(
        'technology',
        [
          {
            technology_id: '0aae0b35-3e18-49a5-9d03-a27fffc585a7',
            name: 'C',
            is_active: true,
          },
          {
            technology_id: '3183ce9d-7e7b-4a2b-9b25-4b0a1f2e5741',
            name: 'C++',
            is_active: true,
          },
          {
            technology_id: '43d4eccd-f2e5-4486-8e7f-049c68845cf3',
            name: 'C#',
            is_active: true,
          },
          {
            technology_id: '35d32af3-f166-4c33-a076-8f26625d81df',
            name: 'Visual Basic',
            is_active: true,
          },
          {
            technology_id: 'dd0f2c80-708a-4d43-8ed4-6b0f7740e3e5',
            name: 'Java',
            is_active: true,
          },
          {
            technology_id: '76beab7c-02d1-4ef6-97bf-f325965467b8',
            name: 'Python',
            is_active: true,
          },
          {
            technology_id: 'f1ccead5-c0be-401a-8a91-afea8fb3d737',
            name: 'JavaScript',
            is_active: true,
          },
          {
            technology_id: 'ea5cd15a-12ec-4050-8985-d3cdd120741b',
            name: 'TypeScript',
            is_active: true,
          },
          {
            technology_id: '4e626e16-f3b7-4ea3-aaf3-97d54c43794d',
            name: 'Node.js',
            is_active: true,
          },
          {
            technology_id: 'de1b5044-21c2-4632-b0b0-c8fcc6d0ef78',
            name: 'React.js',
            is_active: true,
          },
          {
            technology_id: '57500fc6-2771-4eba-ba06-99cc01fbb92f',
            name: 'Vue.js',
            is_active: true,
          },
          {
            technology_id: '563d9fef-8d3c-406a-b129-099946219d8a',
            name: 'Angular',
            is_active: true,
          },
          {
            technology_id: '865f5497-6e57-4d20-931a-4044e3d78b45',
            name: 'Svelte',
            is_active: true,
          },
          {
            technology_id: 'a0b9c959-6353-4f19-bb84-da191ab05e36',
            name: 'PHP',
            is_active: true,
          },
          {
            technology_id: 'b71d2c70-328c-47e9-ac83-5aa5374239a7',
            name: 'SQL',
            is_active: true,
          },
          {
            technology_id: '162bd74e-98c9-49f7-bb72-a5e40e9de0f1',
            name: 'MySQL',
            is_active: true,
          },
          {
            technology_id: 'e9f6d1cb-9eb4-45bd-b5a6-813feb7ad62c',
            name: 'PostgreSQL',
            is_active: true,
          },
          {
            technology_id: '1f082b73-5c1c-4b26-87e9-ff0246ff7e55',
            name: 'PL/SQL',
            is_active: true,
          },
          {
            technology_id: '67fdd4a7-c03b-47c0-8c28-b748cbc9c10a',
            name: 'COBOL',
            is_active: true,
          },
          {
            technology_id: '17f07c14-0950-46be-a4c7-7240ea00d948',
            name: 'Rust',
            is_active: true,
          },
          {
            technology_id: 'c1932ac4-5d33-460a-9e2f-43ab5bb2c288',
            name: 'Ruby on Rails',
            is_active: true,
          },
          {
            technology_id: '14a8e072-f0c8-46cc-8c92-1d9e1909cb91',
            name: 'Elm',
            is_active: true,
          },
          {
            technology_id: '768c9932-4384-44c3-969b-c22e471e34f3',
            name: 'Go',
            is_active: true,
          },
          {
            technology_id: '09c34e81-9635-4200-ba36-b7feaf392373',
            name: 'Scala',
            is_active: true,
          },
          {
            technology_id: '6196619c-5428-4a85-baa1-ec7602e13771',
            name: 'Swift',
            is_active: true,
          },
        ],
        {},
      );
    await runner.run([() => USERS(), () => TAGS(), () => TECHNOLOGIES()]);
  },

  down: async (queryInterface, Sequelize) => {
    await runner.run([
      () => queryInterface.bulkDelete('user'),
      () => queryInterface.bulkDelete('tag'),
      () => queryInterface.bulkDelete('technology'),
    ]);
  },
};
