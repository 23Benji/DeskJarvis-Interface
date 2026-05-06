import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-player.html',
  styleUrl: './music-player.scss'
})
export class MusicPlayerComponent {
  @ViewChild('audioPlayer') audioRef!: ElementRef<HTMLAudioElement>;

  playlist = [
    { title: 'LoFi', artist: 'Desk Jarvis', src: '/assets/music/track1.mp3' },
    { title: 'Chill Piano', artist: 'Desk Jarvis', src: '/assets/music/track2.mp3' },
    { title: 'White Noise', artist: 'Desk Jarvis', src: '/assets/music/track3.mp3' },
  ];

  index = 0;
  playing = false;
  currentTime = 0;
  duration = 0;

  get currentTrack() {
    return this.playlist[this.index];
  }

  togglePlay() {
    const audio = this.audioRef.nativeElement;
    if (this.playing) {
      audio.pause();
    } else {
      audio.play();
    }
    this.playing = !this.playing;
  }

  nextTrack() {
    this.index = (this.index + 1) % this.playlist.length;
    this.autoPlay();
  }

  prevTrack() {
    this.index = (this.index - 1 + this.playlist.length) % this.playlist.length;
    this.autoPlay();
  }

  autoPlay() {
    this.playing = true;
    // Wait a tiny bit for the src to update
    setTimeout(() => this.audioRef.nativeElement.play(), 50);
  }

  onTimeUpdate() {
    const audio = this.audioRef.nativeElement;
    this.currentTime = audio.currentTime;
    this.duration = audio.duration || 0;
  }

  onEnded() {
    this.nextTrack();
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  get progressWidth() {
    if (!this.duration) return '0%';
    return (this.currentTime / this.duration) * 100 + '%';
  }
}
