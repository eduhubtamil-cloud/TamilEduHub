export type ResourceValidationResult = {
  isValid: boolean;
  errors: string[];
}

export function validateResourceForPublishing(resource: any): ResourceValidationResult {
  const errors: string[] = [];

  // Title
  if (!resource.title || resource.title.trim() === '') {
    errors.push('Title is required');
  }

  // Slug
  if (!resource.slug || resource.slug.trim() === '') {
    errors.push('Slug is required');
  }

  // File
  if (!resource.file_url || resource.file_url.trim() === '') {
    errors.push('File URL is required');
  }

  // Audience / Education Segment
  if (!resource.education_segment_id) {
    errors.push('Audience / Education Segment is required');
  } else {
    // If it's School or Teacher, they often need a Standard. But let's check segment slug if available.
    // If we only have the UUID, we can't strictly validate standard_id without querying DB.
    // We'll relax standard_id strictly on the client side, but server side we can warn.
    // For now, only require standard_id if we definitively know it's not a competitive exam.
    // Given we only have the object in this pure function, we remove the strict `standard_id` requirement here,
    // and let the UI guide the user.
  }

  // Subject is still generally required for all
  if (!resource.subject_id) {
    errors.push('Subject is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
