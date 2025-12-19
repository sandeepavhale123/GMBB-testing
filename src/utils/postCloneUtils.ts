
import { Post } from '../types/postTypes';

export interface CreatePostFormData {
  listings: string[];
  title: string;
  postType: string;
  description: string;
  image: File | string | null;
  imageSource: 'local' | 'ai' | 'gallery' | null;
  ctaButton: string;
  ctaUrl: string;
  publishOption: string;
  scheduleDate: string;
  platforms: string[];
  startDate: string;
  endDate: string;
  couponCode: string;
  redeemOnlineUrl: string;
  termsConditions: string;
  postTags: string;
  siloPost: boolean;
  autoScheduleFrequency: string;
  autoScheduleTime: string;
  autoScheduleDay: string;
  autoScheduleDate: string;
  autoScheduleRecurrenceCount: number;
}

export const transformPostForCloning = (post: Post): CreatePostFormData => {
  return {
    listings: [],
    title: post.title ? `Copy of ${post.title}` : 'Copy of Untitled Post',
    postType: '', // Will be empty so user can select
    description: post.content || '',
    image: post.media?.images || null,
    imageSource: post.media?.images ? 'ai' : null,
    ctaButton: '',
    ctaUrl: '',
    publishOption: 'now',
    scheduleDate: '',
    platforms: [],
    startDate: '',
    endDate: '',
    couponCode: '',
    redeemOnlineUrl: '',
    termsConditions: '',
    postTags: post.tags || '',
    siloPost: false,
    autoScheduleFrequency: '',
    autoScheduleTime: '',
    autoScheduleDay: '',
    autoScheduleDate: '',
    autoScheduleRecurrenceCount: 0
  };
};
