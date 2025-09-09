import React from "react";
import { Button } from "@/components/ui/button";

export const CTASection: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white p-8 rounded-lg my-8">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          BOOST YOUR GBP SCORE & Increase your calls
        </h2>
        <p className="text-lg mb-6 leading-relaxed">
          Learn how to pay your employees a month's salary by simply fixing what's 
          broken. Get your free blueprint to crush your competition!
        </p>
        <Button 
          variant="secondary" 
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};