# AI Resume Analyzer

A comprehensive React component built with TypeScript that provides AI-powered resume analysis using Hugging Face models. Upload resume files and receive detailed scoring, feedback, and improvement suggestions.

## Features

- ✅ **AI-Powered Analysis**: Uses Hugging Face LayoutLMv3 model for document understanding
- ✅ **Multiple File Formats**: Supports PDF, DOCX, DOC, PNG, JPG, JPEG
- ✅ **Comprehensive Scoring**: Detailed analysis across 4 key criteria (100-point scale)
- ✅ **Professional Feedback**: Strengths, weaknesses, and actionable improvements
- ✅ **Job Type Targeting**: Optional job-specific analysis and recommendations
- ✅ **Drag & Drop Upload**: Intuitive file upload with progress tracking
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Real-time Progress**: Visual feedback during AI analysis
- ✅ **Dark Mode Support**: Follows system theme preferences
- ✅ **Secure Processing**: Privacy-focused with no permanent file storage

## Scoring Criteria

### Content Quality (40 points)
- Work experience relevance and impact
- Education and qualifications alignment
- Skills matching and technical competencies
- Achievements with quantifiable results

### Formatting & Layout (30 points)
- Section organization and logical structure
- Consistent spacing and professional alignment
- Clear headings and visual hierarchy
- Overall readability and presentation

### Design Consistency (15 points)
- Font usage and readability standards
- Appropriate color scheme and contrast
- Visual appeal and modern design principles
- Professional aesthetic quality

### Job Relevance (15 points)
- Industry-specific keyword optimization
- Role-relevant experience emphasis
- Skills alignment with target position
- Terminology matching job requirements

## Dependencies

```json
{
  "dependencies": {
    "@radix-ui/react-*": "latest",
    "lucide-react": "latest", 
    "class-variance-authority": "latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

## Environment Variables

Add these to your `.env.local` file:

```bash
HUGGINGFACE_API_KEY=your_hugging_face_api_key
HUGGINGFACE_MODEL_ID=microsoft/layoutlmv3-base
GROQ_API_KEY=your_groq_api_key  # For AI analysis text generation
```

## File Structure

```
components/
  resume-analyzer.tsx          # Main component
lib/
  resume-utils.ts             # Utility functions for validation
app/
  resume-analyzer/
    page.tsx                  # Demo page
    loading.tsx               # Loading component
```

## Utility Functions

The component uses several utility functions from `@/lib/resume-utils.ts`:

- `validateResumeFile()` - Validates file type, size, and format
- `formatFileSize()` - Formats file size in human-readable format
- `getTextStatistics()` - Calculates word count, character count, and reading time
- `VALIDATION_ERRORS` - Standardized error messages

## Supported File Types

- ✅ `.docx` (Microsoft Word 2007+)
- ❌ `.doc` (Legacy Word format - not supported)
- ❌ `.pdf` (PDF files - not supported in this component)
- ❌ `.txt` (Plain text - not needed, already readable)

## Error Handling

The component handles various error scenarios:

- **Invalid file type**: Shows error for non-.docx files
- **File too large**: Configurable size limit with clear messaging
- **Empty files**: Detects and rejects empty documents
- **Corrupted files**: Handles mammoth extraction errors gracefully
- **No text found**: Alerts when document contains no readable text

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Privacy & Security

- 🔒 **Client-side processing**: All file processing happens in the browser
- 🔒 **No server uploads**: Files are never sent to external servers
- 🔒 **No data storage**: Extracted text is not cached or stored
- 🔒 **Memory cleanup**: File data is properly disposed after processing

## Accessibility

The component follows WCAG 2.1 guidelines:

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- Semantic HTML structure

## Customization

The component uses CSS classes from your Tailwind CSS configuration and shadcn/ui components. You can customize the appearance by:

1. **Tailwind Classes**: Pass custom classes via the `className` prop
2. **Theme Variables**: Modify your CSS custom properties for colors
3. **Component Variants**: Extend the shadcn/ui components used

## Example Implementation

Visit `/resume-analyzer` in your application to see a full implementation with:

- Header section with gradient background
- Feature showcase
- Privacy information
- Mobile-responsive layout

## Contributing

When contributing to this component:

1. Maintain TypeScript strict mode compliance
2. Add proper JSDoc comments for new functions
3. Include error handling for edge cases
4. Test with various .docx file formats
5. Ensure accessibility compliance

## License

This component is part of the Edunova project and follows the same licensing terms.
