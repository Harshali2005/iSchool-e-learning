import React, { useEffect, useState } from 'react';
import API from '../services/api';
import CourseCard from '../components/CourseCard';

export default function Courses(){
  const [courses, setCourses] = useState([]);
  useEffect(()=> {
    API.get('/courses').then(res=>setCourses(res.data)).catch(console.error);
  }, []);
  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">All Courses</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {courses.map(c => <CourseCard key={c._id} course={c} />)}
      </div>
    </div>
  );
}
