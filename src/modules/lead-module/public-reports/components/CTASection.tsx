import React from "react";
import { Button } from "@/components/ui/button";

export const CTASection: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white p-8 rounded-lg my-8">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Improve Your GMB Performance?
        </h2>
        <p className="text-lg mb-6 leading-relaxed">
          Let's work together to boost your Google My Business score and increase your local visibility. 
          Our team of experts will help you implement all the recommendations from this audit and 
          create a comprehensive local SEO strategy tailored to your business.
        </p>
        <Button 
          variant="secondary" 
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
        >
          Let's Work Together
        </Button>
      </div>
    </div>
  );
};