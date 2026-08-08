import Academy from '../models/AcademyClass.js';

// @desc    Get all academy courses
// @route   GET /api/academy
export const getAcademyCourses = async (req, res, next) => {
  try {
    const courses = await Academy.find({});
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new academy course (Admin)
// @route   POST /api/academy
// @desc    Create a new academy course (Admin)
// @route   POST /api/academy
export const createCourse = async (req, res, next) => {
  try {
    const { 
      title, 
      category, 
      duration, 
      level, 
      price, 
      description, 
      syllabus, 
      popular, 
      status 
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: 'Title, category, and price are required fields.' });
    }

    let formattedSyllabus = [];
    if (Array.isArray(syllabus)) {
      formattedSyllabus = syllabus;
    } else if (typeof syllabus === 'string' && syllabus.trim() !== '') {
      formattedSyllabus = syllabus.split(',').map(item => item.trim());
    }

    const newCourse = new Academy({
      title,
      category,
      duration: duration || 'Flexible',
      level: level || 'All Levels',
      price,
      // Provide a default description if the form field was left blank
      description: (description && description.trim() !== '') 
        ? description 
        : 'Comprehensive course covering foundational to advanced techniques.',
      syllabus: formattedSyllabus,
      popular: Boolean(popular),
      status: status || 'Active'
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('❌ Error creating course:', error);
    next(error);
  }
};
// @desc    Update a course (Admin)
// @route   PUT /api/academy/:id
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Academy.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Handle syllabus formatting if present in update payload
    if (req.body.syllabus && typeof req.body.syllabus === 'string') {
      req.body.syllabus = req.body.syllabus.split(',').map(item => item.trim());
    }

    Object.assign(course, req.body);

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error('❌ Error updating course:', error);
    next(error);
  }
};

// @desc    Update course status or popularity (Admin)
// @route   PUT /api/academy/:id/status
export const updateCourseStatus = async (req, res, next) => {
  try {
    const { status, popular } = req.body;
    const course = await Academy.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (status !== undefined) course.status = status;
    if (popular !== undefined) course.popular = popular;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course (Admin)
// @route   DELETE /api/academy/:id
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Academy.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.deleteOne();
    res.json({ message: 'Course removed successfully' });
  } catch (error) {
    next(error);
  }
};