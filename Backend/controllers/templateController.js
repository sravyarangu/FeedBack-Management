import XLSX from 'xlsx';

// Generate Excel template for different entities
export const generateTemplate = (templateType) => {
  let columns = [];
  let fileName = '';

  switch (templateType) {
    case 'batch':
      columns = ['program', 'batch year'];
      fileName = 'Batch_Upload_Template.xlsx';
      break;

    case 'program':
      columns = ['program', 'duration'];
      fileName = 'Program_Upload_Template.xlsx';
      break;

    case 'branch':
      columns = ['program', 'branch', 'specialisation'];
      fileName = 'Branch_Upload_Template.xlsx';
      break;

    case 'hod':
      columns = ['name', 'email', 'branch', 'designation'];
      fileName = 'HOD_Upload_Template.xlsx';
      break;

    case 'student':
      columns = ['roll number', 'name', 'dob', 'branch', 'program', 'specialisation', 'batch', 'regulation'];
      fileName = 'Student_Upload_Template.xlsx';
      break;

    case 'faculty':
      columns = ['name', 'email', 'branch', 'designation'];
      fileName = 'Faculty_Upload_Template.xlsx';
      break;

    case 'subject':
      columns = ['subject code', 'name', 'program', 'branch', 'regulation', 'year', 'semester', 'type'];
      fileName = 'Subject_Upload_Template.xlsx';
      break;

    case 'feedback_questions':
      columns = ['S.No', 'Criteria'];
      fileName = 'Feedback_Questions_Template.xlsx';
      break;

    case 'feedback_mapping':
      columns = ['Map ID', 'Program', 'Batch Year', 'Branch', 'Year', 'Semester', 'Subject Code', 'Faculty Code'];
      fileName = 'Feedback_Mapping_Template.xlsx';
      break;

    default:
      throw new Error('Invalid template type');
  }

  // Create worksheet with headers
  const ws = XLSX.utils.aoa_to_sheet([columns]);

  // Set column widths
  ws['!cols'] = columns.map(() => ({ wch: 20 }));

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  return { workbook: wb, fileName };
};

// Controller to download template
export const downloadTemplate = async (req, res) => {
  try {
    const { type } = req.params;

    const { workbook, fileName } = generateTemplate(type);

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Send buffer
    res.send(buffer);
  } catch (error) {
    console.error('Download template error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to generate template' 
    });
  }
};
