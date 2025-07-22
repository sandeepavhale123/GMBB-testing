
import React, { useState } from 'react';
import { Textarea } from '../../ui/textarea';

export const AIInstructionsTextarea: React.FC = () => {
  const [instructions, setInstructions] = useState('');

  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-3">Additional Instructions</h3>
      <Textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Mention your business name, include contact info, or other custom notes..."
        rows={4}
        className="resize-none"
      />
    </div>
  );
};
