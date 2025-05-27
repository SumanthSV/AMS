import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
  gracePeriodMins: {
    type: Number,
    default: 15
  },
  overtimeRules: {
    enabled: {
      type: Boolean,
      default: false
    },
    minHours: {
      type: Number,
      default: 8
    },
    rate: {
      type: Number,
      default: 1.5
    }
  },
  geoFencingEnabled: {
    type: Boolean,
    default: false
  },
  coordinates: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    radius: {
      type: Number,
      default: 100 // in meters
    }
  },
  lateMarkPenalty: {
    enabled: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      default: 0
    },
    maxPerMonth: {
      type: Number,
      default: 3
    }
  },
  absentPenalty: {
    enabled: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  workingHours: {
    perDay: {
      type: Number,
      default: 8
    },
    perWeek: {
      type: Number,
      default: 40
    }
  },
  notificationSettings: {
    email: {
      enabled: {
        type: Boolean,
        default: true
      },
      events: {
        checkIn: {
          type: Boolean,
          default: false
        },
        checkOut: {
          type: Boolean,
          default: false
        },
        leaveRequest: {
          type: Boolean,
          default: true
        },
        leaveApproval: {
          type: Boolean,
          default: true
        },
        lateMarkWarning: {
          type: Boolean,
          default: true
        }
      }
    },
    sms: {
      enabled: {
        type: Boolean,
        default: false
      },
      events: {
        checkIn: {
          type: Boolean,
          default: false
        },
        checkOut: {
          type: Boolean,
          default: false
        },
        leaveRequest: {
          type: Boolean,
          default: false
        },
        leaveApproval: {
          type: Boolean,
          default: true
        },
        lateMarkWarning: {
          type: Boolean,
          default: false
        }
      }
    }
  }
}, { 
  timestamps: true 
});

// Ensure only one config document exists
systemConfigSchema.statics.findOneOrCreate = async function() {
  const config = await this.findOne();
  if (config) {
    return config;
  } else {
    return await this.create({});
  }
};

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);

export default SystemConfig;