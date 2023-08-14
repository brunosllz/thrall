import { Summary } from './summary';

describe('Summary', () => {
  it('should be able create a resume', () => {
    const content = 'a'.repeat(1000);

    const resume = Summary.create(content);
    expect(resume.content).toHaveLength(503);
  });
});
