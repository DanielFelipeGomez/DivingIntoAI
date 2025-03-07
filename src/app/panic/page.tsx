import React from "react";

export default function PanicPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI Integration Challenges & Solutions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Disadvantages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Disadvantages
          </h2>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Technical disadvantages
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Significant increase in the size of the JavaScript bundle</li>
              <li>Higher initial load time for users</li>
              <li>Dependence on external services for AI processing</li>
              <li>Possible latency issues in AI responses</li>
              <li>Additional complexity in the application architecture</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Economic disadvantages
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Additional costs for using AI APIs</li>
              <li>Unexpected price escalation with increasing user numbers</li>
              <li>Investment in training the team to handle AI technologies</li>
              <li>Unexpected price escalation with increasing user numbers</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              User experience disadvantages
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Inconsistent or inaccurate responses from AI models</li>
              <li>Possible user frustration with unexpected responses</li>
              <li>Longer wait times to process complex queries</li>
              <li>Difficulty debugging issues related to AI</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Privacy and security disadvantages
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Concerns about handling sensitive user data</li>
              <li>Risks of compliance with regulations like GDPR or CCPA</li>
              <li>Possible vulnerabilities specific to AI systems</li>
              <li>Dependence on external providers for data security</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Specific limitations of the Vercel AI SDK
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vinculation to the Vercel ecosystem</li>
              <li>Possible changes in the API that require frequent updates</li>
              <li>Limited support for certain AI models or functionalities</li>
              <li>Documentation that may not cover all use cases</li>
            </ul>
          </section>
        </div>

        {/* Right Column - Solutions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Solutions & Tips
          </h2>

          <section>
            <h3 className="text-xl font-semibold mb-3">Technical solutions</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Implement lazy loading for AI components</li>
              <li>
                Use server-side processing when possible to reduce client load
              </li>
              <li>Implement caching strategies for common AI requests</li>
              <li>
                Set up fallback mechanisms for when AI services are unavailable
              </li>
              <li>Consider edge computing options for faster response times</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Economic strategies</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Set usage limits and alerts to prevent unexpected costs</li>
              <li>Implement tiered access based on user subscription levels</li>
              <li>
                Consider hybrid approaches with simpler algorithms for basic
                tasks
              </li>
              <li>Negotiate volume-based pricing with AI service providers</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              User experience improvements
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide clear feedback about AI processing status</li>
              <li>Set appropriate user expectations about AI capabilities</li>
              <li>
                Implement user feedback mechanisms to improve AI responses
              </li>
              <li>
                Design graceful fallbacks for when AI responses are inadequate
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Privacy and security best practices
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Anonymize data before sending to AI services when possible
              </li>
              <li>Implement clear consent mechanisms for AI processing</li>
              <li>
                Regularly audit AI interactions for potential security issues
              </li>
              <li>
                Consider using on-premise or edge AI solutions for sensitive
                data
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Vercel AI SDK optimization
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Stay updated with the latest SDK versions and features</li>
              <li>
                Contribute to the open-source community to address limitations
              </li>
              <li>
                Build abstraction layers to make future provider changes easier
              </li>
              <li>Maintain comprehensive testing for AI-dependent features</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
